// import { useState } from "react";
// import { Button } from "@/components/ui/button";

// export default function CounterApp() {
//   const [count, setCount] = useState(0); // State to hold the count

//   return (
//     <div className="flex flex-col items-center gap-4 p-4">
//       <p className="text-xl font-bold">Count: {count}</p>
//       <Button  variant="outline" onClick={() => setCount(count + 1)}>Increase Count</Button>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CounterApp() {
  const [count, setCount] = useState(0);

  // ✅ useEffect to update document title when count changes
  useEffect(() => {
    document.title = `Count: ${count}`; // Updates browser tab title
  }, [count]); // Runs only when `count` changes

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-xl font-bold">Count: {count}</p>
      <Button variant="outline" onClick={() => setCount(count + 1)}>
        Increase Count
      </Button>
    </div>
  );
}
