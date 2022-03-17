# syntax=docker/dockerfile:1
FROM golang:1.18.0 AS builder
RUN mkdir /build
ADD . /build
WORKDIR /build
RUN go mod tidy
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o main .


FROM alpine

RUN mkdir /app

COPY --from=builder /build/main /app
ADD static static
ADD frontend/build static/ticktacktoe
CMD ["/app/main"]

