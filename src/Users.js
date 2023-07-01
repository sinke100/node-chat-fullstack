import React from 'react';

function UserList(props) {
  const { users } = props;

function renderUsers(username,color) {
return (
<li style={{ color: color, textShadow: '1px 1px #000'}}>
      {username}
    </li>);
}

return (
<div style={{ paddingLeft: '1rem'}}>
    <ul className="Messages-list">
<p>There are {users.length} users:</p>

      {users.map(s => renderUsers(s.username,s.color))}
    </ul>
</div>
  );
 
}

export default UserList;
