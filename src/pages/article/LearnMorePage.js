import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  createTheme,
  ThemeProvider,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  CardActions,
  IconButton,
} from "@mui/material";
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
          {/* 자세히 보기 버튼 추가 */}
          <Link to={`/detail/${index}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
              자세히 보기
            </Button>
          </Link>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const LearnMorePage = () => {
  const [value, setValue] = React.useState(0);
  const history = useHistory(); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   // 디테일 페이지로 이동하는 함수
   const handleDetailClick = (index) => {
    history.push(`/detail/${index}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link
              to="/drink-recommendation"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />
        
        {/* 여기서부터 탭 바 */}
        <Box sx={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="맛집" {...a11yProps(0)} />
            <Tab label="술" {...a11yProps(1)} />
            <Tab label="안주" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <div>
        <CustomTabPanel value={value} index={0}>
          Item One
          <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600 }}>
            <CardMedia
              component="img"
              height="194"
              image="https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVlcnxlbnwwfHwwfHx8MA%3D%3D"
              alt="Paella dish"
              sx={{ width: '50%', objectFit: 'cover' }}
            />
            <CardContent sx={{ flex: '1' }}>
              <CardHeader
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2023"
              />
              <Typography variant="body2" color="text.secondary">
                This impressive paella is a perfect party dish and a fun meal to cook
              </Typography>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </CardContent>
          </Card>
        </CustomTabPanel>
        
        <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
        </div>
        
         {/* 글쓰기 버튼 */}
        <Link to="/write-page" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
            글쓰기
          </Button>
        </Link>

      </div>
    </ThemeProvider>
  );
};

export default LearnMorePage;
