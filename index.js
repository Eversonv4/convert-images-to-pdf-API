const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const sizeOf = require("buffer-image-size");

const path = require("path");

const app = express();

// Set up Multer middleware to handle file uploads
const upload = multer();

// Serve the public directory as a static site
app.use(express.static(path.join(__dirname, "public")));

// Disable CORS policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Define a route that accepts a POST request with an image file
app.post("/convert", upload.single("image"), (req, res) => {
  // Get the image buffer from the request
  const imageBuffer = req.file.buffer;

  // Get Image Dimensions
  const dimensions = sizeOf(imageBuffer);

  // Passing image dimensions to pdfDoc object
  const pdfDoc = new PDFDocument({
    size: [dimensions.width, dimensions.height],
  });

  // Stream the PDF document to the response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=image.pdf");
  pdfDoc.pipe(res);

  // Add the image buffer to the PDF document without resizing it
  pdfDoc.image(imageBuffer, 0, 0, {
    width: dimensions.width,
    height: dimensions.height,
  });

  // End the PDF document and the response
  pdfDoc.end();
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
