import React from 'react';

import './file-loader.css';

export const FileLoader = () => {
  return (
	<div className='file-loader-container'>
		<div className='file-loader-files'></div>
		<div className='file-loader-form-container'>
			<form method='post' action="http://localhost:7380/page" onSubmit={e => {
				 e.preventDefault();

				 const data = new FormData(e.target);

				 fetch('http://localhost:7380/page', {
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data; boundary=boundary',
					},
					body: data,
				 })
			}} encType='multipart/form-data' novalidate>
				<input type="text" placeholder='Write a description' name='description'/>
				<input type="file" name='file'/>
				<input type="submit" value="Send"/>
			</form>
		</div>
	</div>
  )
}

export default FileLoader;

