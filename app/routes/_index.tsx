import { Link, NavLink, defer, useLoaderData } from "@remix-run/react";
import prisma from "~/utils/db.server";

export const loader = async () => {
  const Posts = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  });

  return defer({ posts: Posts });
};

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Link to="login">Login</Link>
      <div className="bg-gray-900 text-teal-50 font-bold my-8 px-4">
        <h1 className="mx-2 ">Homepage</h1>
        <div className="">
          <ul className="overflow-x-hidden pb-12">
            {data.posts && data.posts.length > 0 ? (
              data.posts?.map((post) => (
                <li
                  key={post.id}
                  className="my-4 border-2 border-green-300 px-2"
                >
                  <NavLink to={post.id} preventScrollReset>
                    {post.title}
                  </NavLink>
                </li>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
