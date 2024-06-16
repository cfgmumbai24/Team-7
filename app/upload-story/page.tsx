// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';

// const Post: React.FC = () => {
//   const router = useRouter();
//   const [heading, setHeading] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append('heading', heading);
//     formData.append('description', description);
//     if (image) {
//       formData.append('image', image);
//     }

//     try {
//       const response = await axios.post('/api/posts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Post created:', response.data);

//       // Reset form
//       setHeading('');
//       setDescription('');
//       setImage(null);
//       setIsLoading(false);
//       router.push('/'); // Redirect to home page or another page
//     } catch (error) {
//       console.error('Error creating post:', error);
//       setIsLoading(false);
//       // Handle errors appropriately
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Create a New Post</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="heading">Heading:</label>
//           <input
//             type="text"
//             id="heading"
//             value={heading}
//             onChange={(e) => setHeading(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="image">Image:</label>
//           <input
//             type="file"
//             id="image"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0]) || new File()}
//           />
//         </div>
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Creating Post...' : 'Create Post'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Post;