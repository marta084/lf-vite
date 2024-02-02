import { Link } from "@remix-run/react";

export default function Homepage() {
  return (
    <div className="bg-slate-500 font-bold flex flex-1">
      <Link to="login">Login</Link>
      <h1 className="text-lime-200 mx-2 border-2 px-2">tHomeepage</h1>
      <div>
        <h4>test</h4>
        <div>
          <div>test</div>
        </div>
      </div>
    </div>
  );
}
