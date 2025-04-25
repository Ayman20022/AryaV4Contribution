import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const NetworkDialog = ({
  showNetworkDialog,
  setShowNetworkDialog,
  user,
  getNetworkedUsers_,
  getNetworkingUsers_,
  getCustomAvatar,
  navigate,
}) => {
  return (
    <Dialog
      open={showNetworkDialog !== null}
      onOpenChange={(isOpen) => !isOpen && setShowNetworkDialog(null)}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {showNetworkDialog === "followers"
              ? "Networked with "
              : "Networking with "}
            {user.firstName + " " + user.lastName}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(showNetworkDialog === "followers"
                ? getNetworkedUsers_()
                : getNetworkingUsers_()
              ).map((user) => (
                <TableRow key={user.id}>
                  <Link to={`/profile/${user.username}`}>
                    <TableCell className="flex items-center space-x-3">
                      <img
                        src={
                          user.avatarUrl ||
                          getCustomAvatar(user.firstName, user.lastName)
                        }
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {user.firstName + " " + user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </TableCell>
                  </Link>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkDialog;
