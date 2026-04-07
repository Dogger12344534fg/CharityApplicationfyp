// const axios = require('axios');

// async function getUsers() {
//   try {
//     const response = await axios.get('https://jsonplaceholder.typicode.com/users');

//     console.log('Users List:');

//     response.data.forEach((user) => {
//       console.log('----------------------------');
//       console.log(`ID: ${user.id}`);
//       console.log(`Name: ${user.name}`);
//       console.log(`Username: ${user.username}`);
//       console.log(`Email: ${user.email}`);
//       console.log(`Phone: ${user.phone}`);
//       console.log(`Website: ${user.website}`);
//       console.log(`Company: ${user.company.name}`);
//       console.log(`City: ${user.address.city}`);
//     });
//   } catch (error) {
//     console.log('Error fetching users:', error.message);
//   }
// }

// async function createUser() {
//   try {
//     const response = await axios.post(
//       'https://jsonplaceholder.typicode.com/users',
//       {
//         name: 'Dipendra Roka',
//         username: 'dipendra123',
//         email: 'dipendra@example.com',
//         phone: '9800000000',
//         website: 'dipendra.com'
//       }
//     );

//     console.log('New User Created:');
//     console.log(response.data);
//   } catch (error) {
//     console.log('Error creating user:', error.message);
//   }
// }

// async function updateUser(id) {
//   try {
//     const response = await axios.put(
//       `https://jsonplaceholder.typicode.com/users/${id}`,
//       {
//         name: 'Updated Dipendra',
//         username: 'updated_user',
//         email: 'updated@example.com'
//       }
//     );

//     console.log('Updated User:');
//     console.log(response.data);
//   } catch (error) {
//     console.log('Error updating user:', error.message);
//   }
// }

// async function deleteUser(id) {
//   try {
//     const response = await axios.delete(
//       `https://jsonplaceholder.typicode.com/users/${id}`
//     );

//     console.log('Deleted User Response:');
//     console.log(response.data);
//   } catch (error) {
//     console.log('Error deleting user:', error.message);
//   }
// }

// async function main() {
//   console.log('Starting Axios Program...\n');

//   await getUsers();

//   console.log('\nCreating User...\n');
//   await createUser();

//   console.log('\nUpdating User...\n');
//   await updateUser(1);

//   console.log('\nDeleting User...\n');
//   await deleteUser(1);

//   console.log('\nProgram Finished');
// }

// main();
