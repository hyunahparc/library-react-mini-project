import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';

// fetch books based on search query
const fetchBooks = async (query: string) => {
  if (!query) return [];

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Search failed");
  return response.json();
};

const Header = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);
  const navigate = useNavigate();

  // fetch search suggestions
  const { data } = useQuery({
    queryKey: ['books', debouncedSearch],
    queryFn: () => fetchBooks(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  // close dropdown when clicking outside
  const searchRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // top 5 suggestions
  const suggestions = data?.docs?.slice(0, 5) || [];

  // handle selecting a suggestion
  const handleSelect = (workKey: string) => {
    setSearch("");
    setOpen(false);
    navigate(`/books/${workKey.replace("/works/", "")}`); // "/works/OLxxxxW"
  };

  // handle form submit
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!debouncedSearch.trim()) return;
    setOpen(false);
    navigate(`/search?q=${debouncedSearch}`);
  };


  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">📚 Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="/advanced-search">Search</Nav.Link>
          </Nav>
          {/* search box */}
          <Form className="d-flex position-relative" onSubmit={handleSubmit} ref={searchRef}>
            <Form.Control
              type="search"
              placeholder="Search book"
              className="me-2"
              aria-label="Search"
              value={search}
              autoComplete="off"
              style={{ zIndex: 1001 }}
              onChange={(e) =>  {
                setSearch(e.target.value);
                setOpen(true);
              }}
            />
            <Button variant="outline-success" onClick={handleSubmit}>Search</Button>

            {/* search suggestions list */}
            {open &&  suggestions.length > 0 && (
              <ListGroup
                className="position-absolute w-100"
                style={{ top: "100%", zIndex: 1000 }}
              >
                {suggestions.map((book: any) => (
                  <ListGroup.Item
                    key={book.key}
                    action
                    onMouseDown={() => handleSelect(book.key)}
                  >
                    <strong>{book.title}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {book.author_name?.[0] || "Unknown author"}
                      {book.first_publish_year &&
                        ` · ${book.first_publish_year}`}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
          )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;