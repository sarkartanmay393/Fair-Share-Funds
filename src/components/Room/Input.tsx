import * as React from 'react';
import { SxProps, Theme, styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import { Avatar, Box, Button, IconButton, Input, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

interface InputProps {
  styles: SxProps<Theme>;
  usersId?: string[];
}

export default function InputBar({ styles, usersId }: InputProps) {
  const [age, setAge] = React.useState('0');
  const handleChange = (event: { target: { value: string } }) => {
    setAge(event.target.value);
  };
  return (
    <Box sx={{ ...styles, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <Box display='flex' justifyContent='space-evenly' gap={1} >
        <Select
          id="demo-customized-select"
          value={age}
          defaultValue={age}
          onChange={handleChange}
          sx={{ border: 0, outline: 0, boxShadow: 0, '&:hover': { border: 0, outline: 0, boxShadow: 0 } }}
        >
          <MenuItem value="0">

            <Avatar>None</Avatar>
          </MenuItem>
          <MenuItem value={12}>
            <Avatar>P</Avatar>
          </MenuItem>
          <MenuItem value={20}>
            <Avatar>D</Avatar>
          </MenuItem>
          <MenuItem value={30}>
            <Avatar>R</Avatar>
          </MenuItem>
        </Select>
        <NativeSelect
          id="demo-customized-select-native"
          value={age}
          onChange={handleChange}
          variant='outlined'
          sx={{ outline: 0, border: 0, width: "120px" }}
        >
          <option value="paid">Paid</option>
          <option value="due">Due</option>
        </NativeSelect>
        <FormControl sx={{ m: 1 }} variant="standard">
          {/* <InputLabel htmlFor="demo-customized-textbox">Amount</InputLabel>
          <Input /> */}
          <TextField id="outlined-basic" label="Amount" variant="outlined" sx={{padding: "0px"}} />
        </FormControl>
      </Box>
      <IconButton> <Send sx={{fontSize: "18px"}} /></IconButton>
    </Box >
  );
}