// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { SITE_WIDTH_STYLES } from "@/utils/constants.ts";
import Layout from "@/components/Layout.tsx";
import Head from "@/components/Head.tsx";
import type { State } from "./_middleware.ts";
import ItemSummary from "@/components/ItemSummary.tsx";
import {
  getAllItems,
  getUsersByIds,
  type Item,
  type User,
  getItemCommentsCountsByIds,
  type Item,
} from "@/utils/db.ts";

interface HomePageData extends State {
  users: User[];
  items: Item[];
  commentsCounts: number[];
}

export const handler: Handlers<HomePageData, State> = {
  async GET(_req, ctx) {
    const items = await getAllItems();
    const users = await getUsersByIds(items.map((item) => item.userId));
    const commentsCounts = await getItemCommentsCountsByIds(
      items.map((item) => item.id),
    );
    return ctx.render({ ...ctx.state, items, commentsCounts, users });
  },
};

export default function HomePage(props: PageProps<HomePageData>) {
  return (
    <>
      <Head />
      <Layout isLoggedIn={props.data.isLoggedIn}>
        <div class={`${SITE_WIDTH_STYLES} divide-y flex-1 px-8`}>
          {props.data.items.map((item, index) => (
            <ItemSummary
              item={item}
              commentsCount={props.data.commentsCounts[index]}
              user={props.data.users[index]}
            />
          ))}
        </div>
      </Layout>
    </>
  );
}
