const socket = io();

const addProductBtn = document.getElementById('addProductBtn');
const deleteBtn = document.getElementById("deleteBtn");

addProductBtn.addEventListener('click', function(e) {
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    category: document.getElementById('category').value,
    thumbnail: document.getElementById('thumbnail').value,
    code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
    };
    //emito al servidor el producto nuevo
    socket.emit('addProduct', product);
    title.value = '';
    description.value = '';
    price.value = '';
    category.value = '';
    thumbnail.value = '';
    code.value = '';
    stock.value = '';
  });
  
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let productId = document.getElementById("productId").value; // Obtengo el valor del campo de entrada
    // Emito al servidor el ID del producto que quiero eliminar
    socket.emit("deleteProduct", productId);
    document.getElementById("productId").value = ''; // Limpio el campo de entrada
  });
  
  
  socket.on("updatedProducts", (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpio la lista actual
    
    products.forEach((product) => {
      const li = document.createElement("li");
      const title = document.createElement("h3");
      title.textContent = product.name; 
      li.appendChild(title);
      const description = document.createElement("p");
      description.textContent = "Description: " + product.description;
      li.appendChild(description);
      const price = document.createElement("p");
      price.textContent = "Price: " + product.price;
      li.appendChild(price);
      const category = document.createElement("p");
      price.textContent = "Category: " + product.category;
      li.appendChild(category);
      const thumbnail = document.createElement("p");
      thumbnail.textContent = "Thumbnail: " + product.thumbnail;
      li.appendChild(thumbnail);
      const code = document.createElement("p");
      code.textContent = "Code: " + product.code;
      li.appendChild(code);
      const stock = document.createElement("p");
      stock.textContent = "Stock: " + product.stock;
      li.appendChild(stock);
      const id = document.createElement("p");
      stock.textContent = "ID: " + product._id;
      li.appendChild(id);        
      productList.appendChild(li);
    });
  });
    
  function addToCart(button, productId) {
    var successMessage = button.nextElementSibling;
    successMessage.style.display = 'block'; //msj emergente al presionar el boton addtocart
  
    // Oculto el mensaje después de 3 segundos
    setTimeout(function() {
      successMessage.style.display = 'none';
    }, 3000); // Envío el ID del producto al servidor
    socket.emit('addToCart', productId);
  }