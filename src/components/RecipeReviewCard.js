import React from "react";
import { Card, CardContent, IconButton, CardActions, CardHeader, CardMedia, Typography, Tooltip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add'; // Assuming you have imported AddIcon
import { Link } from 'react-router-dom';

const RecipeReviewCard = ({ article, handleLike }) => {
  console.log(`Article ID1: ${article.id}, isLikedByUser1: ${article.isLikedByUser}`);
  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, height: 250 }}>
      <CardMedia
        component="img"
        height="194"
        image={article.imgUrl || "https://images.unsplash.com/photo-1590189182193-1fd44f2b4048?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt="Article Image"
        sx={{ width: '50%', objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: '1', overflow: 'hidden' }}>
        <CardHeader
          title={article.title}
          subheader={new Date(article.regDate).toLocaleDateString()}
          titleTypographyProps={{ noWrap: true }}
        />
        <Typography variant="body2" color="text.secondary" noWrap>
          {article.body}
        </Typography>
        <CardActions disableSpacing>
         <IconButton
            onClick={() => handleLike(article.id)}
            color={article.isLikedByUser ? "secondary" : "default"}
            aria-label="add to favorites"
          >
            <FavoriteIcon />
          </IconButton>
          
          <Typography>{article.point || 0}</Typography>
          <Tooltip title="자세히 보기" placement="top" enterDelay={500}>
            <IconButton
              sx={{ position: 'absolute', right: 16, bottom: 16 }}
              component={Link}
              to={`/detail/${article.id}`}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
   
      </CardContent>
    </Card>
  );
};

export default RecipeReviewCard;
