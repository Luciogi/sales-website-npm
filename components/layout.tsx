import { Nav } from "./navbar";
import Foot from "./footer";
type MyComponentProps = React.PropsWithChildren<{}>;

export default function Layout({ children }: MyComponentProps) {
  return (
    <>
      <main className="md:container md:mx-auto">
        <Nav />
        <main>{children}</main>
        <Foot />
      </main>
    </>
  );
}
