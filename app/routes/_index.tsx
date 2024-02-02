import { json } from "@remix-run/server-runtime"
import { NavLink, useLoaderData } from "@remix-run/react"
import prisma from "../utils/db.server"

export const loader = async () => {
  const Posts = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  })

  return json({ posts: Posts })
}

export default function Index() {
  // const { posts } = useLoaderData() as DeferredData
  const data = useLoaderData<typeof loader>()

  return (
    <div className="mb-auto">
      <div className="my-8"></div>
      <h1> WELCOME TO A GAMING NEWS PLATFORM</h1>

      <div className="container bg-background">
        <ul className="overflow-y-auto overflow-x-hidden pb-12">
          {data.posts && data.posts.length > 0 ? (
            data.posts?.map((potz) => (
              <li key={potz.id} className="my-4 border-2 border-green-300 px-2">
                <NavLink to={potz.id} preventScrollReset>
                  {potz.title}
                </NavLink>
              </li>
            ))
          ) : (
            <p>No posts yet</p>
          )}
        </ul>
      </div>
    </div>
  )
}
