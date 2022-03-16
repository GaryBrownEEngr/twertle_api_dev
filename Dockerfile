FROM alpine

RUN mkdir /app
WORKDIR /app
COPY main .
ADD static static
CMD ["/app/main"]




# FROM golang:alpine
# RUN mkdir /app
# ADD . /app
# WORKDIR /app
# RUN go build -o main .
# CMD ["/app/main"]