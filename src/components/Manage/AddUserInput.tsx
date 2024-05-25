import { PersonAdd } from "@mui/icons-material";
import { Box, Input, IconButton, CircularProgress } from "@mui/material";
import { Dispatch } from "react";

interface AddUserInputProps {
  searchInfo: string;
  setSearchInfo: Dispatch<React.SetStateAction<string>>;
  addButtonLoading: boolean;
  handleAddNewUser: () => void;
}

const AddUserInput = ({
  searchInfo,
  setSearchInfo,
  addButtonLoading,
  handleAddNewUser,
}: AddUserInputProps) => {
  return (
    <Box
      component="form"
      display="flex"
      px={2}
      width="100%"
      justifyContent="space-between"
      border="1px solid"
      borderRadius="8px"
    >
      <Input
        disableUnderline
        value={searchInfo}
        onChange={(e) => setSearchInfo(e.target.value)}
        sx={{ width: "85%", border: "px solid red" }}
        placeholder="Type username or email"
      />
      <IconButton
        type="submit"
        aria-label="search"
        sx={{ width: "10%", p: 2 }}
        disabled={addButtonLoading}
        onClick={handleAddNewUser}
      >
        {addButtonLoading ? <CircularProgress size={16} /> : <PersonAdd />}
      </IconButton>
    </Box>
  );
};

export default AddUserInput;
