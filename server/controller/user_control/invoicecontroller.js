const fs = require('fs');
const path = require('path');
const os = require('os');
const PDFDocument = require('pdfkit');
const Orderdb = require('../../model/odermodel');

const generateOrderInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Orderdb.findById(orderId)
      .populate('items.productId')
      .populate('address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const downloadsFolder = path.join(os.homedir(), 'Downloads');
    const filePath = path.join(downloadsFolder, `${orderId}.pdf`);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Add logo
    const logoPath = path.join(__dirname, '/uplode/logo');
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 50 });
    } else {
        console.error('Logo image not found at', logoPath);
    }
    
    doc.moveDown();
    
    // Invoice details
    doc.fontSize(12)
       .text(`Invoice No.: ${order._id}`, { align: 'right' })
       .text(`Invoice Date: ${new Date().toISOString().split('T')[0]}`, { align: 'right' })
       .text(`Due Date: ${new Date().toISOString().split('T')[0]}`, { align: 'right' })
       .moveDown();
    
    // Billed from
    doc.text('Billed From', 50, 160)
       .font('Helvetica-Bold')
       .text('BAGSON')
       .font('Helvetica')
       .text('BAGSON@gmail.com')
       .text('123 Neyyattinkara')
       .text('TVM, ST 12345')
       .text('INDIA')
       .moveDown();
    
    // Billed to
    doc.text('Billed To', 300, 160)
       .font('Helvetica-Bold')
       .text(order.address.name)
       .font('Helvetica')
       .text(order.address.email)
       .text(order.address.address)
       .text(order.address.locality)
       .text(order.address.state)
       .text(order.address.pincode)
       .moveDown();
    
    // Table headers
    const tableTop = 250;
    const itemCodeX = 50;
    const descriptionX = 220; // Moved a bit to the right
    const quantityX = 280;
    const priceX = 370;
    const amountX = 450;
    
    doc.font('Helvetica-Bold');
    doc.text('Item Code', itemCodeX, tableTop)
       .text('Description', descriptionX, tableTop)
       .text('Qty', quantityX, tableTop, { width: 50, align: 'right' })
       .text('Price', priceX, tableTop, { width: 80, align: 'right' })
       .text('Amount', amountX, tableTop, { width: 80, align: 'right' });
    
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();
    
    // Helper function to split text into lines
    function splitTextIntoLines(text, maxLength) {
        const lines = [];
        let currentLine = '';
    
        text.split(' ').forEach(word => {
            if ((currentLine + word).length > maxLength) {
                lines.push(currentLine.trim());
                currentLine = '';
            }
            currentLine += `${word} `;
        });
    
        if (currentLine.trim().length > 0) {
            lines.push(currentLine.trim());
        }
    
        return lines;
    }
    
    // Table rows
    doc.font('Helvetica');
    let position = tableTop + 30;
    order.items.forEach(item => {
        const product = item.productId;
        const productNameLines = splitTextIntoLines(product.product_name, 10);
    
        doc.text(product._id, itemCodeX, position);
    
        productNameLines.forEach((line, index) => {
            doc.text(line, descriptionX, position + (index * 15)); // 15 is the line height
        });
    
        doc.text(item.quantity, quantityX, position, { width: 50, align: 'right' })
           .text(`Rs.${product.price}`, priceX, position, { width: 80, align: 'right' })
           .text(`Rs.${product.price * item.quantity}`, amountX, position, { width: 80, align: 'right' });
    
        position += (productNameLines.length * 15) > 20 ? (productNameLines.length * 15) : 20;
    });
    
    // Footer
    doc.moveTo(50, position + 20)
       .lineTo(550, position + 20)
       .stroke();
       doc.moveDown()
       doc.moveDown()
       doc.moveDown()
    doc.text(`Total Amount: Rs.${order.totalAmount}`, { align: 'right' });
    
    doc.moveDown()
       .fontSize(12)
       .text('Thank You for Shopping at BAGSON!', { align: 'center' });
    
    doc.end();
    
    



    stream.on('finish', () => {
      res.download(filePath, `${orderId}.pdf`, () => {
        fs.unlinkSync(filePath);
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  generateOrderInvoice
};
