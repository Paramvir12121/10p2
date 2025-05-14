// 'use client';

// import React, { useEffect, useState } from 'react';

// const Page = () => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/db');
//         if (!response.ok) {
//           throw new Error('Failed to fetch database data');
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//       }
//     };

//     fetchData();
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Database Data</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default Page;