// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as React from "react";
// import { SxProps, Theme } from "@mui/material/styles";
// import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
// import { Send } from "@mui/icons-material";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Message, Room } from "@/interfaces/index.ts";
// import { useStoreState } from "@/store/typedHooks.ts";
// import supabase from "@/utils/supabase/supabase.ts";

// interface InputProps {
//   styles?: SxProps<Theme>;
//   usersId?: string[];
//   roomData: Room;
// }

// export default function MessageInputBar({ roomData }: InputProps) {
//   const { user } = useStoreState((state) => state);
//   const [, setError] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   const sendMessage = async (newMessage: Partial<Message>, resetForm: any) => {
//     try {
//       setLoading(true);
//       const { error } = await supabase
//         .from("messages")
//         .insert(newMessage)
//         .select()
//         .single();

//       if (error) {
//         throw error;
//       }

//       setLoading(false);
//       resetForm();
//     } catch (e) {
//       setLoading(false);
//       console.log(e);
//       setError(String(e));
//     }
//   };

//   const useMessageInputFormik = useFormik({
//     initialValues: { message: "" },
//     validationSchema: Yup.object().shape({
//       message: Yup.string().min(1).required(),
//     }),
//     onSubmit: (values, { setSubmitting, resetForm }) => {
//       setTimeout(() => {
//         setError("");
//         const newMessage = {
//           from_user: user?.id,
//           room_id: roomData.id,
//           text: values.message,
//         } as Partial<Message>;

//         sendMessage(newMessage, resetForm);
//         setSubmitting(false);
//       }, 0);
//     },
//   });

//   return (
//     <Box
//       component="form"
//       position="fixed"
//       bottom={10}
//       borderRadius={20}
//       height="64px"
//       width={{ xs: "95%" }}
//       display="flex"
//       alignItems="center"
//       justifyContent="space-between"
//       bgcolor="background.paper"
//       onSubmit={useMessageInputFormik.handleSubmit}
//     >
//       <Box
//         flex={1}
//         display="flex"
//         justifyContent={{ xs: "space-evenly", md: "flex-start" }}
//         alignItems="center"
//         ml={{ xs: 1.25, md: 2 }}
//       >
//         <TextField
//           required
//           type="text"
//           size="small"
//           name="message"
//           label="Message"
//           variant="outlined"
//           value={useMessageInputFormik.values.message}
//           onChange={useMessageInputFormik.handleChange}
//           sx={{ width: "100%", padding: "0px", ml: { xs: 0.5, md: 1 } }}
//         />
//       </Box>
//       <Box
//         display="flex"
//         justifyContent="end"
//         pl={{ xs: 1, md: 2 }}
//         mr={{ md: 2 }}
//       >
//         <IconButton
//           disabled={useMessageInputFormik.isSubmitting}
//           type="submit"
//           sx={{}}
//         >
//           {loading ? <CircularProgress /> : <Send sx={{ fontSize: "22px" }} />}
//         </IconButton>
//       </Box>
//     </Box>
//   );
// }
