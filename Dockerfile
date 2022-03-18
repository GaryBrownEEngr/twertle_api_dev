# syntax=docker/dockerfile:1

FROM golang:1.18.0-alpine AS builder_Go
RUN mkdir /backend
ADD /backend /backend
WORKDIR /backend
RUN go mod tidy
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o main .


# https://hub.docker.com/_/node/
FROM node:16-alpine AS builder_Node
RUN mkdir /frontend
ADD /frontend /frontend
WORKDIR /frontend
RUN npm run build


FROM alpine
RUN mkdir /app
COPY --from=builder_Go /backend/main /app
COPY --from=builder_Node /frontend/build static/ticktacktoe/
ADD static static
CMD ["/app/main"]

