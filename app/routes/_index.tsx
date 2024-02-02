import { Link } from "@remix-run/react";

export default function Homepage() {
  return (
    <>
      <Link to="login">Login</Link>
      <div className="bg-gray-900 text-teal-50 font-bold my-8 px-4">
        <h1 className="mx-2 ">Homepage</h1>
        <div>
          <h4>test</h4>
        </div>
      </div>
    </>
  );
}
