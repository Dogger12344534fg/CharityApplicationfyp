// ```javascript
// const axios = require('axios');

// class ApiService {
//   constructor(baseURL) {
//     this.client = axios.create({
//       baseURL: baseURL,
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });

//     this.client.interceptors.request.use(
//       (config) => {
//         console.log(`Sending request to: ${config.url}`);
//         config.headers['Authorization'] = 'Bearer dummy_token_12345';
//         return config;
//       },
//       (error) => {
//         console.error('Request Error:', error.message);
//         return Promise.reject(error);
//       }
//     );

//     this.client.interceptors.response.use(
//       (response) => {
//         console.log(`Received response with status: ${response.status}`);
//         return response;
//       },
//       (error) => {
//         if (error.response) {
//           console.error('Response Error:', error.response.status);
//           console.error('Error Data:', error.response.data);
//         } else if (error.request) {
//           console.error('No response received from server');
//         } else {
//           console.error('Unexpected Error:', error.message);
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   async getAllUsers() {
//     try {
//       const response = await this.client.get('/users');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch users');
//       return [];
//     }
//   }

//   async getUserById(userId) {
//     try {
//       const response = await this.client.get(`/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to fetch user with ID ${userId}`);
//       return null;
//     }
//   }

//   async createUser(userData) {
//     try {
//       const response = await this.client.post('/users', userData);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create user');
//       return null;
//     }
//   }

//   async updateUser(userId, updatedData) {
//     try {
//       const response = await this.client.put(`/users/${userId}`, updatedData);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to update user with ID ${userId}`);
//       return null;
//     }
//   }

//   async deleteUser(userId) {
//     try {
//       const response = await this.client.delete(`/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to delete user with ID ${userId}`);
//       return null;
//     }
//   }

//   async fetchPosts() {
//     try {
//       const response = await this.client.get('/posts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch posts');
//       return [];
//     }
//   }

//   async createPost(postData) {
//     try {
//       const response = await this.client.post('/posts', postData);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create post');
//       return null;
//     }
//   }

//   async fetchComments(postId) {
//     try {
//       const response = await this.client.get(`/posts/${postId}/comments`);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to fetch comments for post ${postId}`);
//       return [];
//     }
//   }

//   async uploadFile(fileBuffer, fileName) {
//     try {
//       const response = await this.client.post('/upload', {
//         fileName: fileName,
//         fileContent: fileBuffer.toString('base64')
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload file');
//       return null;
//     }
//   }
// }

// async function main() {
//   const api = new ApiService('https://jsonplaceholder.typicode.com');

//   console.log('Fetching all users...');
//   const users = await api.getAllUsers();
//   console.log(users);

//   console.log('Fetching user by ID...');
//   const singleUser = await api.getUserById(1);
//   console.log(singleUser);

//   console.log('Creating a new user...');
//   const newUser = await api.createUser({
//     name: 'Dipendra Roka',
//     username: 'dipendra_dev',
//     email: 'dipendra@example.com'
//   });
//   console.log(newUser);

//   console.log('Updating existing user...');
//   const updatedUser = await api.updateUser(1, {
//     name: 'Updated User Name',
//     email: 'updated@example.com'
//   });
//   console.log(updatedUser);

//   console.log('Deleting user...');
//   const deletedUser = await api.deleteUser(1);
//   console.log(deletedUser);

//   console.log('Fetching posts...');
//   const posts = await api.fetchPosts();
//   console.log(posts.slice(0, 5));

//   console.log('Creating a new post...');
//   const newPost = await api.createPost({
//     title: 'Axios Dummy Post',
//     body: 'This is a very long dummy post body for testing Axios requests in Node.js applications.',
//     userId: 1
//   });
//   console.log(newPost);

//   console.log('Fetching comments for a post...');
//   const comments = await api.fetchComments(1);
//   console.log(comments.slice(0, 3));

//   console.log('Uploading file...');
//   const uploadResult = await api.uploadFile(Buffer.from('Dummy File Content'), 'dummy.txt');
//   console.log(uploadResult);
// }

// main()
//   .then(() => {
//     console.log('Program completed successfully');
//   })
//   .catch((error) => {
//     console.error('Unexpected program failure:', error);
//   });
// ```

// ---

// ```javascript
// const axios = require('axios');

// async function fetchProducts() {
//   try {
//     const response = await axios.get('https://fakestoreapi.com/products');

//     console.log('All Products:');

//     response.data.forEach((product, index) => {
//       console.log(`
// Product Number: ${index + 1}`);
//       console.log(`Title: ${product.title}`);
//       console.log(`Price: $${product.price}`);
//       console.log(`Category: ${product.category}`);
//       console.log(`Description: ${product.description}`);
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error.message);
//   }
// }

// async function addProduct() {
//   try {
//     const response = await axios.post('https://fakestoreapi.com/products', {
//       title: 'Gaming Laptop',
//       price: 1500,
//       description: 'A very powerful gaming laptop with RTX graphics card and 32GB RAM.',
//       image: 'https://example.com/laptop.png',
//       category: 'electronics'
//     });

//     console.log('New Product Added:');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error adding product:', error.message);
//   }
// }

// async function updateProduct(productId) {
//   try {
//     const response = await axios.put(`https://fakestoreapi.com/products/${productId}`, {
//       title: 'Updated Gaming Laptop',
//       price: 1800,
//       description: 'Updated version with better cooling system.',
//       image: 'https://example.com/new-laptop.png',
//       category: 'electronics'
//     });

//     console.log('Updated Product:');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error updating product:', error.message);
//   }
// }

// async function deleteProduct(productId) {
//   try {
//     const response = await axios.delete(`https://fakestoreapi.com/products/${productId}`);

//     console.log('Deleted Product Result:');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error deleting product:', error.message);
//   }
// }

// async function runProgram() {
//   console.log('Starting Dummy Axios Product Program...');

//   await fetchProducts();
//   await addProduct();
//   await updateProduct(5);
//   await deleteProduct(5);

//   console.log('Dummy Axios Program Finished');
// }

// runProgram();
// ```
