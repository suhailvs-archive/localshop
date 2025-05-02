import Listings from "@/components/Listings";

export default function UserWants (){ 
  return <Listings ltype="W" selectedUserId={global.selectedUserId} />;
}
