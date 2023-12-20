import React, { Dispatch } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import generateRandomName from "@/utils/generateRandomName";

interface RoomDialogProps {
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  handleNewRoom: (roomName: string) => void;
}

export default function RoomCreationDialog({
  show,
  setShow,
  handleNewRoom,
}: RoomDialogProps) {
  const [roomName, setRoomName] = React.useState<string>("");

  const handleClose = (code?: string) => {
    if (code === "reset") {
      setRoomName("");
    }
    setShow(false);
  };

  const suggestedName = generateRandomName();

  return (
    <React.Fragment>
      <Dialog
        open={show}
        onClose={() => handleClose()}
        fullWidth
        component="form"
        onSubmit={() => handleNewRoom(roomName ? roomName : suggestedName)}
      >
        <DialogTitle>Creating New Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            focused
            margin="dense"
            id="RoomName"
            label="Room Name"
            name="RoomName"
            placeholder={suggestedName}
            type="name"
            fullWidth
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            variant="outlined"
          />
          <TextField
            disabled
            // autoFocus
            margin="dense"
            id="users"
            label="Users"
            type="text"
            fullWidth
            variant="outlined"
          />

          {/* <Select
            disabled
            fullWidth
            // disableUnderline
            variant="standard"
            // multiple
            value={""}
            // onChange={handleChange}
            input={<OutlinedInput label="Chip" />}
            renderValue={() => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem key={"name"} value={"name"}></MenuItem>
          </Select> */}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontWeight: 600 }}
            type="reset"
            onClick={() => handleClose("reset")}
          >
            Discard
          </Button>
          <Button
            sx={{ fontWeight: 600 }}
            type="submit"
            onClick={() => handleClose()}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
