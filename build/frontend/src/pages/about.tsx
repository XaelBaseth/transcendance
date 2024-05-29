import React from 'react';
import AmelieImage from "../assets/aramier.jpg"
import AxelImage from "../assets/acharlot.jpg"
import RaphaelImage from "../assets/rrault.jpg"
import ValentinImage from "../assets/vmalassi.jpg"
import '../styles/About.css';

interface Member {
	name: string;
	github: string;
	image: string;
	quote: string;
}

const teamMembers: Member[] = [
	{
		name: 'Amelie',
		github: 'https://github.com/Sireas03',
		image: AmelieImage,
		quote: 'Pokemon > FF14 :)'
	},
	{
		name: 'Axel',
		github: 'https://github.com/XaelBaseth',
		image: AxelImage,
		quote: 'Vous connaissez FF14 ?',
	},
	{
		name: 'Raphael',
		github: 'https://github.com/xXCARRELAGEXx',
		image: RaphaelImage,
		quote: 'Champion de GeoGuessr'
	},
	{
		name: 'Valentin',
		github: 'https://github.com/ValentinMalassigne',
		image: ValentinImage,
		quote: 'inserez phrase cool ici',
	},
];


function About() {
	return (
		<div className='aboutus'>
			<div className='staff'>
				{teamMembers.map((member, index) => (
					<div className='container_staff' key={index}>
					<img className='image' src={member.image} alt={member.name} />
					<div className='text'>
						<h2>{member.name}</h2>
						<p><a href={member.github} >{member.github}</a></p>
						<h3>{member.quote}</h3>
					</div>
					</div>
				))}	
			</div>
		</div>
	);
}

export default About;