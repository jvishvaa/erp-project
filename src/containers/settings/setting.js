import React, { Component, useState, useEffect, useContext } from 'react';
import { FormikConsumer, useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
// import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
// import Avatar from 'material-ui/Avatar';
import { Avatar } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { SketchPicker } from 'react-color'
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import logo from '../../assets/images/logo_mobile.png';
import Vibrant from 'node-vibrant'
import axiosInstance from '../../config/axios';
// import axios from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';
// import { applyTheme } from '../../redux/actions/theme-provider-actions'
import { CardHeader } from '@material-ui/core';




const useStyles = makeStyles({
  root: {

    maxWidth: 700,
    margin: "auto",
    marginTop: "10%",
    display: "flex",
    flexDirection: "row"


  },
  logoupdate: {
    width: "300px",
    // border: "1px solid",
    borderRadius: "5px",
    height: "200px"
  },
  colors: {
    width: "300px",
    borderRadius: "5px",
    marginLeft: "1%",
    overflow: "initial",
    // border: "1px solid",
    height: "200px"
  },
  imgpreview: {
    // borderRadius: "50%",
    // border: "0.5px solid",
    height: 110,
    width: 110,
    marginLeft: "32%",
    marginTop: "6%"

  },
  primarycolor: {
    display: "flex",
    alignItems: "center"

  },
  secondrycolor: {
    display: "flex",
    alignItems: "center"

  },
  //   choosefile:{
  //     marginLeft:"29%"
  //   },
  //   themesubmitbtn:{
  //     marginLeft : "29%"
  //   },
  choosetheme: {
    marginLeft: "8%",

  },
  logoheader: {
    marginLeft: "33%"
  },
  themeheader: {
    marginLeft: "26%"
  }
  //   themegrid : {
  //     marginTop:"5%"
  //   }
});

const validationSchema = yup.object({
  //   email: yup
  //     .string('Enter your email')
  //     .email('Enter a valid email')
  //     .required('Email is required'),
  //   password: yup
  //     .string('Enter your password')
  //     .min(8, 'Password should be of minimum 8 characters length')
  //     .required('Password is required'),
});

const Setting = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);

  const classes = useStyles();

  const hiddenFileInput = React.useRef(null);
  const [image, setImage] = useState();
  const [pickprimarycolor, setpickprimarycolor] = useState(false)
  const [secondarycolor, setsecondarycolor] = useState("#014b7e")
  const [picksecondarycolor, setpicksecondarycolor] = useState(false)
  const [colors, setcolors] = useState([])
  const [primarycolor, setprimarycolor] = useState("#ff6b6b")
  const [currentpricolor, setcurrentpricolor] = useState(null)
  const [currentseccolor, setcurrentseccolor] = useState(null)
  // const [finalTheme, setFinalTheme] = useState({
  //   primary: "",
  //   secondary: ""
  // })



  const [bgcolor, setbgcolor] = useState("white")
  const [imgdetail, setimgdetail] = useState()
  const [imgupdate, setimgupdate] = useState(false)
  const [colorupdate, setcolorupdate] = useState(false)
  const [scholData, setscholData] = useState(null)

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // useEffect(()=>{

  //   props.applyTheme(currentpricolor?currentpricolor:primarycolor,currentseccolor?currentseccolor:secondarycolor)

  // },[])
  // useEffect(() => {
  //   props.applyTheme(finalTheme.primary, finalTheme.secondary)
  // }, [finalTheme])

  // useEffect(() => {
  //   let temp = JSON.parse(localStorage.getItem("schoolDetails")) || {}
  //   let primarytemp = ""
  //   let secondrytemp = ""
  //   temp.themeDetails.map(ele => {
  //     if (ele.theme_key === "primary_color") {
  //       primarytemp = ele.theme_value
  //     }
  //     else {
  //       secondrytemp = ele.theme_value
  //     }

  //   })
  //   setFinalTheme({
  //     primary: primarytemp,
  //     secondary: secondrytemp
  //   })
  // }, [])


  useEffect(() => {
    const schooldata = JSON.parse(localStorage.getItem("schoolDetails")) || {}
    if (schooldata) {
      setscholData(schooldata)
      setImage(schooldata.school_logo)
    }
  }, [])
  useEffect(() => {


    //   axiosInstance
    //     .get(`${endpoints.themeAPI.school_theme}`)
    //     .then((res) => {
    //       if (res.status === 200) {
    //         const result = res.data.result
    //         result.data.map((items) => {
    //           if (items.theme_key === "primary_color") {
    //             setprimarycolor(items.theme_value[0])
    //           } else if (items.theme_key === "second_color") {
    //             setsecondarycolor(items.theme_value[0])
    //           }

    //         })
    //       }

    //     }).catch((error) => {
    //       console.log(error);
    //     });

    var themeData = JSON.parse(localStorage.getItem("themeDetails"));
    if (themeData){
      themeData.forEach((items) => {
        if (items.theme_key === "primary_color") {
          setprimarycolor(items.theme_value)
        } else if (items.theme_key === "second_color") {
          setsecondarycolor(items.theme_value)
        }

      })
    }else{
      setprimarycolor("#ff6b6b")
      setsecondarycolor('#014b7e')
    }
    


  }, [])


  const handlevibrant = (img) => {

    Vibrant.from(img).getPalette().then((palette) => {
      let colors = []
      console.log("palette", palette)
      if (palette.hasOwnProperty("DarkVibrant") && palette["DarkVibrant"])
        setprimarycolor(palette["DarkVibrant"].getHex())

      if (palette.hasOwnProperty("DarkMuted") && palette["DarkMuted"])
        setsecondarycolor(palette["DarkMuted"].getHex())

    })

  }
  const handleClickAway = event => {
    setpickprimarycolor(false)
    setpicksecondarycolor(false)
  }

  const updatecolor = event => {
    setcolorupdate(false)
  }

  // const cancelcolorupdate = event => {
  //   setcolorupdate(false)
  //   setcurrentpricolor(null)
  //   setcurrentseccolor(null)
  // }
  const cancelClick = event => {
    setImage(scholData.school_logo)
    setimgupdate(false)
  }

  function onprimarythemeselect(color) {
    setcolorupdate(true)
    setcurrentpricolor(color.hex)
    // setprimarycolor(color.hex)
    setpickprimarycolor(false)
  }

  function onsecondarythemeselect(color) {
    setcurrentseccolor(color.hex)
    setcolorupdate(true)
    // setsecondarycolor(color.hex)
    setpicksecondarycolor(false)
  }


  function reseteTheme() {
    const themecolors =
      [
        {
          theme_key: "primary_color",
          theme_value: "#ff6b6b",
        },
        {
          theme_key: "second_color",
          theme_value: "#014b7e",
        }

      ]

    localStorage.setItem("themeDetails", JSON.stringify(themecolors));

    axiosInstance
      .post(`${endpoints.themeAPI.school_theme}`, themecolors)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          window.location.reload()
          setAlert('success', res.data.message);
        } else {
          setAlert('error', res.data.description);
        }

      }).catch((error) => {
        console.log(error);
      });

  }


  const formik2 = useFormik({
    initialValues: {
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setbgcolor(primarycolor)
      setcolorupdate(false)
      const params =
        [
          {
            theme_key: "primary_color",
            theme_value: currentpricolor ? currentpricolor : primarycolor,
          },
          {
            theme_key: "second_color",
            theme_value: currentseccolor ? currentseccolor : secondarycolor,
          }

        ]
      // setFinalTheme({
      //   primary: currentpricolor ? currentpricolor : primarycolor,
      //   secondary: currentseccolor ? currentseccolor : secondarycolor
      // })

      // dispatch(props.applyTheme(currentpricolor?currentpricolor:primarycolor,currentseccolor?currentseccolor:secondarycolor))

      // var stored = {}
      // stored = JSON.parse(localStorage.getItem("schoolDetails"));
      // stored["themeDetails"] = params
      localStorage.setItem("themeDetails", JSON.stringify(params));
      //set color in database

      axiosInstance
        .post(`${endpoints.themeAPI.school_theme}`, params)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            window.location.reload()
            setAlert('success', res.data.message);
          } else {
            setAlert('error', res.data.description);
          }

        }).catch((error) => {
          console.log(error);
        });

    }

  });

  const formik1 = useFormik({
    initialValues: {
      imgurl: ''
    },
    validationSchema: validationSchema,
    onSubmit: (value, actions) => {
      setimgupdate(false)
      setcolorupdate(true)
      // console.log("imgdetail",imgdetail)
      const schooldata = JSON.parse(localStorage.getItem("schoolDetails")) || {}
      const formData = new FormData();
      const school_id = schooldata.id
      const school_name = schooldata.school_name
      const school_sub_domain_name = schooldata.school_sub_domain_name
      const school_logo = imgdetail

      formData.set("school_id", school_id)
      formData.set("school_name", school_name)
      formData.set("school_sub_domain_name", school_sub_domain_name)
      formData.set("school_logo", school_logo)


      const data = formData

      axios
        .put(`${endpoints.central_logoupdateAPI.school_logo}`, data, {
          headers: {
            'x-api-key': 'vikash@12345#1231',
          }
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            handlevibrant(URL.createObjectURL(imgdetail))
            setAlert('success', res.data.message);
            const headers = {
              'x-api-key': 'vikash@12345#1231',
            };
            axios.get(`${endpoints.appBar.schoolLogo}?school_sub_domain_name=${school_sub_domain_name}`, { headers })
              .then(response => {
                // var appBarLocalStorage = {}
                // const themecolor = [
                //   {
                //     theme_key: "primary_color",
                //     theme_value: primarycolor,
                //   },
                //   {
                //     theme_key: "second_color",
                //     theme_value: secondarycolor,
                //   }

                // ]
                const appBarLocalStorage = response.data.data;
                // appBarLocalStorage["themeDetails"] = themecolor

                localStorage.setItem('schoolDetails', JSON.stringify(appBarLocalStorage))
              })
              .catch(err => console.log(err))
          } else {
            setAlert('error', res.data.description);
          }

        }).catch((error) => {
          console.log(error);
        });
    },

  });
  return (
    <Layout>
      {/* <Card className={classes.root}>
        <CardContent style={{ display: "flex", position: "absolute" }}>
          <div style={{ marginTop: "-11%" }}> */}
      <Grid
        container
        justifyContent="center"
        alignItems="center" style={{ justifyContent: "center", marginTop: "8%" }}>

        <div>

          <CardHeader title="Logo"></CardHeader>
          <Card className={classes.logoupdate}>
            {/* <img src={image} className={classes.imgpreview} /> */}
            <img src={image} className={classes.imgpreview} />

            <form onSubmit={formik1.handleSubmit} className={classes.choosefile}>
              <input type="file"
                id="imgurl"
                name='imgurl'
                ref={hiddenFileInput}

                style={{ display: 'none' }}
                accept="image/*"
                value={formik1.values.imgurl}
                ref={hiddenFileInput}
                onChange={(e) => {
                  formik1.handleChange(e)
                  if (e.target.files[0]) {
                    setImage(URL.createObjectURL(e.target.files[0]))
                  }
                  setimgupdate(true)

                  setimgdetail(e.target.files[0])
                }
                } />


              {/* <CardActions>
        
      </CardActions> */}
              {imgupdate ? <div style={{ marginLeft: "25%", marginTop: "4%" }}>
                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
                <Button color="primary" variant="contained" onClick={cancelClick} style={{ marginLeft: "2%" }}>
                  Cancel
                </Button>
              </div>
                : <Button color="primary" variant="contained" onClick={handleClick} style={{ marginLeft: "35%", marginTop: "6%" }}>
                  Update
                </Button>}

            </form>
            {/* <CardActions>
              <Button size="small" type="submit">Update</Button>
            </CardActions> */}
          </Card>
        </div>


        <div>
        
          <CardHeader title="Theme"></CardHeader>
          <Card className={classes.colors}>
            <form onSubmit={formik2.handleSubmit} className={classes.choosetheme} >

              <div className={classes.primarycolor}>
                <span>Primary Color</span>
                <div style={{ backgroundColor: currentpricolor ? currentpricolor : primarycolor, height: "50px", width: "50px", border: "1px solid black", marginLeft: "15%", marginTop: "5%" }}
                  onClick={() => setpickprimarycolor(pickprimarycolor => !pickprimarycolor)} >

                  {pickprimarycolor ? <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={handleClickAway}
                  ><SketchPicker
                      color={currentpricolor ? currentpricolor : primarycolor}
                      // onChangeComplete={(color) => { setthemecolor(color.hex) }}
                      onChangeComplete={(color) => { onprimarythemeselect(color) }}

                    /></ClickAwayListener> : null}

                </div>


              </div><br />
              <div className={classes.secondrycolor}>
                <span>Secondary Color</span>
                <div style={{ backgroundColor: currentseccolor ? currentseccolor : secondarycolor, height: "50px", width: "50px", border: "1px solid black", marginLeft: "9%" }}
                  onClick={() => setpicksecondarycolor(picksecondarycolor => !picksecondarycolor)}>
                  {picksecondarycolor ? <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={handleClickAway}
                  ><SketchPicker
                      color={currentseccolor ? currentseccolor : secondarycolor}
                      // onChangeComplete={(color) => { setthemecolor(color.hex) }}
                      onChangeComplete={(color) => { onsecondarythemeselect(color) }}

                    /></ClickAwayListener> : null}

                </div>
              </div><br />
              <div style={{ display: "flex" }}>
                <div>
                  <Button color="primary" variant="contained" onClick={reseteTheme} style={{ marginTop: "-2%" }}>
                    Reset
                  </Button>
                </div>
                <div style={{ marginLeft: "15%" }}>
                  {colorupdate ? <Button color="primary" variant="contained" type="submit" style={{ marginTop: "-2%", display: (pickprimarycolor || picksecondarycolor) ? "none" : "inherit" }}>
                    Save
                  </Button> : null}
                </div>

              </div>
            </form>
          </Card>
        </div>
        {/* </CardContent> */}

      {/* </Card> */}
      </Grid>
    </Layout >
  );
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     applyTheme: (primarytheme, secondarytheme) => dispatch(applyTheme(primarytheme, secondarytheme)),
//   };
// }
export default Setting;

// export default connect(null, mapDispatchToProps)(Setting);
