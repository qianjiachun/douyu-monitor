import { useEffect } from "react";
import { redirectUrl } from "~/utils";

export default function Index() {
  useEffect(() => {
    redirectUrl(window.location.href);
  }, [])

  return (
    <></>
  )
}
