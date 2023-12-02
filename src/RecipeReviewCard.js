import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CardActions from '@mui/material/CardActions';


export default function RecipeReviewCard() {
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLearnMoreClick = () => {
    history.push('/learn-more'); // 경로를 원하는 대로 업데이트하세요.
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* ... (이전 코드는 변경되지 않음) */}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Button onClick={handleLearnMoreClick} color="primary">
          더 알아보기
        </Button>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      {/* ... (이전 코드는 변경되지 않음) */}
    </Card>
  );
}
