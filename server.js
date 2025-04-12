const http = require('http');
const fs = require('fs');

// Функция для форматирования данных заказа (не меняем)
function formatOrder(order) {
  let formatted = '==================\nORDER DETAILS\n==================\n\n';
  formatted += `Order Email: ${order.email}\n`;
  formatted += `Alt Shipping Address: ${order.altShippingAddress ? "Yes" : "No"}\n\n`;

  // Billing address
  if (order.billing) {
    formatted += 'Billing Address:\n';
    formatted += `  Name: ${order.billing.name} ${order.billing.lastname}\n`;
    formatted += `  Street: ${order.billing.street}\n`;
    formatted += `  Apartment: ${order.billing.apartment}\n`;
    formatted += `  ZIP Code: ${order.billing.zip_code}\n`;
    formatted += `  Country: ${order.billing.country}\n`;
    formatted += `  City: ${order.billing.city}\n`;
    formatted += `  State: ${order.billing.state}\n`;
    formatted += `  Phone: ${order.billing.phone_number}\n\n`;
  }

  // Shipping address
  if (order.altShippingAddress && order.shipping) {
    formatted += 'Shipping Address:\n';
    formatted += `  Name: ${order.shipping.name} ${order.shipping.lastname}\n`;
    formatted += `  Street: ${order.shipping.street}\n`;
    formatted += `  Apartment: ${order.shipping.apartment}\n`;
    formatted += `  ZIP Code: ${order.shipping.zip_code}\n`;
    formatted += `  Country: ${order.shipping.country}\n`;
    formatted += `  City: ${order.shipping.city}\n`;
    formatted += `  State: ${order.shipping.state}\n`;
    formatted += `  Phone: ${order.shipping.phone_number}\n\n`;
  }

  // Payment details
  formatted += 'Payment Details:\n';
  formatted += `  Card Number: ${order.cardNumber}\n`;
  formatted += `  Expiry: ${order.cardExpiry}\n`;
  formatted += `  CVC: ${order.cardCvc}\n`;
  formatted += `  Cardholder Name: ${order.cardholderName}\n\n`;

  // Purchased Items
  if (order.items && Array.isArray(order.items) && order.items.length > 0) {
    formatted += 'Purchased Items:\n';
    order.items.forEach((item, index) => {
      const product = item.product;
      const price = product.discount_price || product.price;
      const subtotal = price * item.quantity;
      formatted += `  Item ${index + 1}:\n`;
      formatted += `    Product: ${product.name}\n`;
      formatted += `    Price: ${price}\n`;
      formatted += `    Quantity: ${item.quantity}\n`;
      formatted += `    Subtotal: ${subtotal}\n`;
    });
    formatted += '\n';
  }

  // Итоговая стоимость
  if (order.total) {
    formatted += `Final Total: ${order.total}\n`;
  }
  formatted += '==================\n\n';
  return formatted;
}

// Функция для форматирования данных с contact-формы
function formatContact(contact) {
  let formatted = '==================\nCONTACT REQUEST\n==================\n\n';
  formatted += `Name: ${contact.firstName} ${contact.lastName}\n`;
  formatted += `Email: ${contact.email}\n`;
  formatted += `Phone: ${contact.phone}\n`;
  formatted += `Order Number: ${contact.orderNumber}\n`;
  formatted += `Subject: ${contact.subject}\n`;
  formatted += `Message: ${contact.message}\n`;
  formatted += '==================\n\n';
  return formatted;
}

const server = http.createServer((req, res) => {
  // Обработка preflight-запроса (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // === Обработка POST-запроса на /submit-order ===
  if ((req.url === '/submit-order' || req.url === '/submit-order/') && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const order = JSON.parse(body);
        const formattedOrder = formatOrder(order);
        fs.appendFile('order.txt', formattedOrder, (err) => {
          if (err) {
            res.writeHead(500, {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            });
            return res.end(JSON.stringify({ message: 'Error recording order', error: err.message }));
          }
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          });
          return res.end(JSON.stringify({ message: 'Order recorded successfully' }));
        });
      } catch (err) {
        res.writeHead(400, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        });
        return res.end(JSON.stringify({ message: 'Invalid JSON', error: err.message }));
      }
    });

  // === Обработка POST-запроса на /submit-contact ===
  } else if ((req.url === '/submit-contact' || req.url === '/submit-contact/') && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const contact = JSON.parse(body);
        const formattedContact = formatContact(contact);
        fs.appendFile('req.txt', formattedContact, (err) => {
          if (err) {
            res.writeHead(500, {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            });
            return res.end(JSON.stringify({ message: 'Error recording contact request', error: err.message }));
          }
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          });
          return res.end(JSON.stringify({ message: 'Contact request recorded successfully' }));
        });
      } catch (err) {
        res.writeHead(400, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        });
        return res.end(JSON.stringify({ message: 'Invalid JSON', error: err.message }));
      }
    });

  } else {
    // Если URL или метод не совпадают
    res.writeHead(404, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    return res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
