import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { fetchBooks, deleteBook } from './booksSlice';
import BookForm from '../../components/BookForm';
import Loading from '../../components/Loading';

const BookList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Values from redux store
  const books = useSelector((state) => state.books.books);
  const bookStatus = useSelector((state) => state.books.status);
  const error = useSelector((state) => state.books.error);
  const currentPage = useSelector((state) => state.books.currentPage);
  const hasMore = useSelector((state) => state.books.hasMore);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ref for TableContainer
  const tableContainerRef = useRef(null);

  // Get user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (bookStatus === 'idle') {
      dispatch(fetchBooks({ page: 1, limit: 15 }));
    }
  }, [bookStatus, dispatch]);

  // Load more books on scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && bookStatus !== 'loading') {
          console.log('Fetching more books...');
          dispatch(fetchBooks({ page: currentPage + 1, limit: 15 }));
        }
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [dispatch, currentPage, hasMore, bookStatus]);

  const handleOpenModal = (book, event) => {
    event.stopPropagation();
    setSelectedBook(book);
    setIsEditing(!!book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setIsEditing(false);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation();
    dispatch(deleteBook(id));
  };

  // if (bookStatus === 'loading' && currentPage === 1) {
  //   return <Loading />;
  // }

  if (bookStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, maxHeight: '80vh', overflow: 'auto' }}
        ref={tableContainerRef}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Publication Year</strong></TableCell>
              {isAuthenticated && <TableCell><strong>Edit / Delete</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id} onClick={() => handleBookClick(book._id)} hover>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publicationYear}</TableCell>
                {isAuthenticated && (
                  <TableCell>
                    <Box display="flex" justifyContent="flex-start">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={(event) => handleOpenModal(book, event)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="secondary"
                          onClick={(event) => handleDelete(book._id, event)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BookForm
        open={isModalOpen}
        handleClose={handleCloseModal}
        book={selectedBook}
        isEditMode={isEditing}
      />
    </>
  );
};

export default BookList;
