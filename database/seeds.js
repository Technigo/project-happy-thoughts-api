import booksData from "../data/books.json" assert { type: "json" };
import Book from "./book.js";

const seedDatabase = async () => {
  await Book.deleteMany({});

  booksData.forEach((bookData) => {
    new Book(bookData).save();
  });
};

export default seedDatabase;
