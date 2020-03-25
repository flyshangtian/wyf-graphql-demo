const { ApolloServer, gql } = require("apollo-server");

const libraries = [
  {
    branch: "downtown"
  },
  {
    branch: "riverside"
  }
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    branch: "riverside"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
    branch: "downtown"
  }
];

// Schema definition
const typeDefs = gql`

# A library has a branch and books
  type Library {
    branch: String!
    books: [Book!]
  }

  # A book has a title and author
  type Book {
    title: String!
    author(limit: Int): [Author!]
    libraries
  }

  # An author has a name
  type Author {
    name: String!
  }

  # Queries can fetch a list of libraries
  type Query {
    libraries: [Library]
  }
`;

// Resolver map
const resolvers = {
  Query: {
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    }
  },
  Library: {
    books(parent) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter(book => book.branch === parent.branch);
    }
  },
  Book: {
    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent, args) {
      var myArray = [];
      for (var i = 0; i < args.limit; i++) {
        myArray[i] = {
          name: "12"
        };
      }
      return myArray;
    },

    title(parent) {
      console.log(2);
      return "title";
    }
  }

  // Because Book.author returns an object with a "name" field,
  // Apollo Server's default resolver for Author.name will work.
  // We don't need to define one.
};

// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({ typeDefs, resolvers });

// Launch the server
server.listen(9999).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
