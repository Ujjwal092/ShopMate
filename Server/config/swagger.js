import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShopMate API",
      version: "1.0.0",
      description: "E-commerce Backend API Documentation",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication APIs",
      },
      {
        name: "Products",
        description: "Product APIs",
      },
      {
        name: "Orders",
        description: "Order APIs",
      },
      {
        name: "Admin",
        description: "Admin APIs",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
