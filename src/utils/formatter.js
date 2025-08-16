import moment from 'moment';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  return moment(date).format('MMM DD, YYYY HH:mm');
};

export const formatTimeRemaining = (endTime) => {
  const now = moment();
  const end = moment(endTime);
  const duration = moment.duration(end.diff(now));
  
  if (duration.asMilliseconds() <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};