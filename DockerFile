# Use official nginx image
FROM nginx:latest

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

#Copy application files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
