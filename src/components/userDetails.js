import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Stack } from "@mui/system";
import SearchCategory from "./searchCategory";
import "reactjs-popup/dist/index.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import "./userDetails.css";
import "bootstrap/dist/css/bootstrap.css";
import Pagination from "react-bootstrap/Pagination";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import validator from "validator";

export default function BasicTable() {
  const [userData, setuserData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [editId, setEditId] = useState(-1);
  const [emailError, setEmailError] = useState("");
  const [search, setSearch] = useState("");
  const [update, setUpdate] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [apiData, setApiData] = useState([]);

  // const [copyPageData, setCopyPageData] = useState([]);
  // const [checkedItems, setCheckedItems] = useState([]);
  const [isChecked, setisChecked] = useState([]);
  const [isAllChecked, setisAllChecked] = useState(false);

  const handleNext = () => {
    if (page === pageCount) return page;

    setPage(page + 1);
  };
  const handlePrev = () => {
    if (page === 1) return page;
    setPage(page - 1);
  };
  useEffect(() => {
    // console.log(userData);

    fetchUserData();
  }, [page]);

  const fetchUserData = async () => {
    try {
      let res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setuserData(res.data);
      setApiData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    let timer;
    if (search) {
      timer = setTimeout(() => {
        searchFunction(search);
      }, 500);
    } else {
      setuserData(apiData);
      setPageData(apiData);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [search, page]);

  useEffect(() => {
    const pageDataCount = Math.ceil(userData.length / 10);
    // console.log(pageDataCount);
    setPageCount(pageDataCount);
    if (page) {
      const dataToShow = 10;
      const skip = dataToShow * page;
      const dataShowing = userData.slice(
        page === 1 ? 0 : skip - dataToShow,
        skip
      );
      setPageData(dataShowing);
      // setCopyPageData(dataShowing);
    }
  }, [userData]);

  useEffect(() => {
    if (update.email) {
      const email = update.email;
      if (validator.isEmail(email)) {
        setEmailError("");
      } else {
        setEmailError("enter valid email");
      }
    }
  }, [update]);
  const handleUpdate = (id) => {
    const roleArray = ["member", "admin"];
    userData.map((data) => {
      if (data.id === id) {
        update.name ? (data.name = update.name) : (data.name = data.name);
        update.email ? (data.email = update.email) : (data.email = data.email);
        // update.role ? (data.role = update.role) : (data.role = data.role);
        if (update.role !== "") {
          if (roleArray.includes(update.role)) {
            data.role = update.role;
          } else {
            alert("please enter valid role");
          }
        }
      }
    });
    setEditId(-1);
  };

  const handleId = (id) => {
    setEditId(id);
  };

  const searchFunction = (search) => {
    const arr_name = [];
    const arr_email = [];
    const arr_role = [];

    userData.forEach((data) => {
      if (data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        arr_name.push(data);
      }
    });

    userData.forEach((data) => {
      if (data.email.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        arr_email.push(data);
      }
    });

    userData.forEach((data) => {
      if (data.role.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        arr_role.push(data);
      }
    });
    const arr = Array.from(new Set([...arr_name, ...arr_email, ...arr_role]));

    // console.log(arr);
    // setApiData(arr);
    setuserData(arr);
    setPageData(arr);
  };

  const deleteDetails = (e) => {
    if (isAllChecked) {
      const arr = pageData.map((item) => {
        return item.id;
      });

      const arr1 = userData.filter((item) => {
        if (!arr.includes(item.id)) {
          return item;
        }
      });
      setApiData(arr1);
      setuserData(arr1);
      // setCopyPageData(arr1);
    } else {
      const arr = userData.filter((item) => {
        if (!isChecked.includes(item.id)) {
          return item;
        }
      });

      const arr2 = apiData.filter((item) => {
        if (!isChecked.includes(item.id)) {
          return item;
        }
      });
      setApiData(arr2);
      setuserData(arr);
      // setCopyPageData(arr);
    }
  };

  const deleteDetailsOnDeleteButton = (id) => {
    const arr = userData.filter((item) => {
      if (item.id !== id) {
        return item;
      }
    });
    setuserData(arr);
    // setCopyPageData(arr);
  };

  const handleFirst = () => {
    setPage(1);
  };
  const handleLast = () => {
    setPage(pageCount);
  };

  const handleChangeAllSelect = (e) => {
    // window.location.reload();
    const { name, checked } = e.target;
    console.log(name, "--", checked);

    setisChecked([]);
    setisAllChecked(!isAllChecked);
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setisChecked([...isChecked, value]);
      // setCheckedItems([...checkedItems, value]);
    } else {
      setisChecked(isChecked.filter((e) => e !== value));
    }
  };
  // console.log(checkedItems);
  // console.log(isChecked);
  // console.log(isAllChecked);
  return (
    <>
      <SearchCategory value={search} handleSearch={setSearch} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  value="allSelect"
                  onChange={(e) => {
                    handleChangeAllSelect(e);
                  }}
                />
              </TableCell>

              <TableCell className="tablecell" align="center">
                <b>Name</b>
              </TableCell>
              <TableCell className="tablecell" align="center">
                <b>Email</b>
              </TableCell>
              <TableCell className="tablecell" align="center">
                <b>Role</b>
              </TableCell>
              <TableCell className="tablecell" align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((data) =>
              data.id === editId ? (
                <tr>
                  <td>{data.id}</td>
                  <td>
                    <input
                      type="text"
                      value={update.name}
                      onChange={(e) => {
                        console.log(update);
                        setUpdate({ ...update, name: e.target.value });
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={update.email}
                      onChange={(e) =>
                        setUpdate({ ...update, email: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={update.role}
                      onChange={(e) =>
                        setUpdate({ ...update, role: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleUpdate(data.id);
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    {emailError && (
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        {emailError}
                      </span>
                    )}
                  </td>
                </tr>
              ) : (
                <TableRow
                  key={data.id}
                  className={isAllChecked ? "selected" : "not-selected"}
                >
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      value={data.id}
                      checked={data.isChecked}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {data.name}
                  </TableCell>
                  <TableCell align="center">{data.email}</TableCell>
                  <TableCell align="center">{data.role}</TableCell>
                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row"
                      justifyContent={"center"}
                    >
                      <BorderColorOutlinedIcon
                        onClick={() => {
                          setEditId(data.id);
                        }}
                      />
                      <DeleteOutlinedIcon
                        style={{ color: "red" }}
                        onClick={(e) => {
                          deleteDetailsOnDeleteButton(data.id);
                          // handlealldelete();
                        }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack justifyContent="space-around" direction="row">
        <Chip
          label="Delete Selected"
          size="large"
          color={"error"}
          variant={"default"}
          onClick={(e) => {
            deleteDetails(e);
          }}
        />
        <Pagination>
          <Pagination.First onClick={handleFirst} />
          <Pagination.Prev onClick={handlePrev} />
          {Array(pageCount)
            .fill(null)
            .map((ele, index) => {
              return (
                <Pagination.Item
                  active={page === index + 1 ? true : false}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              );
            })}
          <Pagination.Next onClick={handleNext} />
          <Pagination.Last onClick={handleLast} />
        </Pagination>
      </Stack>
    </>
  );
}
