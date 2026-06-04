fetch("http://localhost:3000/ranking")
.then(res=>res.json())
.then(data=>{

    let html = "";

    data.forEach((player,index)=>{

        html += `
        <tr>
            <td>${index+1}</td>
            <td>${player.username}</td>
            <td>${player.score}</td>
        </tr>
        `;

    });

    document
    .getElementById("rank")
    .innerHTML = html;

});