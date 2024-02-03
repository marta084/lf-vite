import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import prisma from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";

import { formatDistanceToNow } from "date-fns";

// --------------- loader -----------------

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      userImage: {
        select: { id: true, cloudinaryurl: true, updatedAt: true },
      },
    },
    where: {
      username: params.username,
    },
  });

  invariantResponse(user, "User not found", { status: 404 });

  return json({
    user,
    userJoinedDisplay: user.createdAt.toLocaleDateString(),
  });
}

// --------------- action -----------------

// --------------- component -----------------

export default function UserRoute() {
  const data = useLoaderData<typeof loader>();
  const user = data.user;
  const userDisplayName = user.name ?? user.username;

  return (
    <div className=" flex justify-between">
      <div className="mb-auto flex w-full items-center">
        {/* <h1 className="m-4">
					user profile: {data.user.name ?? data.user.username}
				</h1> */}
        <div className="relative">
          <img
            src={data.user.userImage?.cloudinaryurl ?? ""}
            alt={userDisplayName}
            className="h-52 w-52 rounded-full object-cover"
          />
          <p>
            {data.user.userImage?.updatedAt
              ? formatDistanceToNow(new Date(data.user.userImage?.updatedAt)) +
                " ago"
              : null}
          </p>
        </div>

        <Link
          to={`/users/${data.user.username}`}
          className=" overflow-hidden rounded-lg bg-muted px-4 text-lg font-bold text-gray-100 shadow-sm transition duration-200 ease-in-out"
        >
          {userDisplayName}
        </Link>
        <p className="mt-2 text-muted-foreground">
          Joined {data.userJoinedDisplay}
        </p>
      </div>
      <div>
        <div className="pb-4">
          <Link
            to={`/users/${data.user.username}/notes`}
            className="overflow-hidden rounded-lg bg-muted text-lg font-bold shadow-sm  duration-200 ease-in-out hover:transition"
          >
            {userDisplayName} Notes
          </Link>
        </div>
      </div>
    </div>
  );
}

export const meta: MetaFunction<typeof loader> = ({
  data,
  params,
  matches,
}) => {
  console.log(matches);
  const displayName = data?.user.name ?? params.username;
  return [
    { title: `${displayName} Profile` },
    {
      name: "description",
      content: `Checkout ${displayName} Profile`,
    },
  ];
};

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => {
          return <p>No user with the username {params.username} exists</p>;
        },
      }}
    />
  );
}
