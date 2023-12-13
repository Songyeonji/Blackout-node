import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Button,
  CardActions,
  CardHeader,
  CardMedia,
  Collapse,
  Avatar,
  Typography,
  styled,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from "@mui/material/colors";


export default function RecipeReviewCard(isActive ) {


  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, visibility: isActive ? 'visible' : 'hidden' }}>
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

    
  );
}
