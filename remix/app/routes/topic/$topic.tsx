import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {

    // 从请求中获取 rid 参数
    const url = new URL(request.url);
    const rid = url.searchParams.get("rid");

    // 重定向到 '/{rid}'
    if (rid) {
        return redirect(`/${rid}`);
    }

};

export default function TopicRedirect() {
    return (
        <></>
    )
}
