import { Link, NavLink, useMatches } from "@remix-run/react";
import { SearchBar } from "~/components/search-bar";
import { cn } from "~/utils/misc";
import { Button } from "../ui/button";

export default function Header() {
  const matches = useMatches();
  const isOnSearchPage = matches.find((m) => m.id === "routes/users+/index");
  return (
    <header className="bg-header py-4 px-4 bg-gray-900 border-yellow-400 p-4 header-bb">
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="flex justify-between items-center ">
          <div className="flex items-center">
            <h1 className="font-semibold font-sans text-lg mr-4">
              <Link to="/">Marta</Link>
            </h1>
            <NavLink
              to="users"
              className={({ isActive }) =>
                cn(
                  isActive && "underline font-bold text-lg",
                  "px-4 font-semibold font-sans text-sm",
                )
              }
            >
              Users List
            </NavLink>
            <NavLink
              to="test"
              className={({ isActive }) =>
                cn(
                  isActive && "underline font-bold text-lg",
                  "font-semibold font-sans text-sm",
                )
              }
            >
              test
            </NavLink>
            <NavLink
              to="users/Conrad63/notes/new"
              className={({ isActive }) =>
                cn(
                  isActive && "underline font-bold text-lg",
                  "px-4 font-semibold font-sans text-sm",
                )
              }
            >
              Create new note
            </NavLink>
          </div>
          <div className="flex justify-center items-center">
            {isOnSearchPage ? null : (
              <div className="mr-4 max-w-sm flex-1">
                <SearchBar status="idle" />
              </div>
            )}
            <Link to="login">
              <Button type="button">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
