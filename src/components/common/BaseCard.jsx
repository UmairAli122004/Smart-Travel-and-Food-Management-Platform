import React from 'react';
import { Card, CardContent, CardActions, CardHeader, CardMedia } from '@mui/material';

/**
 * BaseCard - A foundational UI component built on top of MUI's Card.
 */
const BaseCard = ({ children, ...props }) => {
  return (
    <Card {...props}>
      {children}
    </Card>
  );
};

BaseCard.Content = CardContent;
BaseCard.Actions = CardActions;
BaseCard.Header = CardHeader;
BaseCard.Media = CardMedia;

export default BaseCard;
