create database dolceval;
create table usuario(
	id serial,
	email varchar (60) not null,
	password varchar (60) not null
);

select * from usuario;