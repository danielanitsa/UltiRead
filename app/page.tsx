import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <Button>
        <SignOutButton />
      </Button>
      <UserButton />
    </>
  );
}
