const userCreationEmail = function (userEmail) {
  console.log(userEmail)
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Alta de usuario',
    html: `
      <p>Felicitaciones, su usario a sido creado exitosamente.</p>
      `,
  };
}

const changePasswordEmail = function (userEmail){
  console.log(userEmail)
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Aviso de cambio de contraseña',
    html: `
      <p>Esta recibiendo este email porque <strong>su contraseña</strong> a sido cambiada exitosamente.<br/>
      Si no fue usted quien requirio esto, porfavor pida un cambio de clave urgentemente.</p>
      `,
  };
}

const resetEmail = function (userEmail, host, token) {
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Reincicio de clave',
    html: `
      <p>Esta recibiendo este email porque <strong>usted (u otra persona)</strong> a pedido el reinicio de clave de su cuenta.<br/>
      Porfavor clickee el siguiente link para completar el proceso:</p>
      <p>http://${host}/reset/${token}</p>
      <p>Si no fue usted quien requirio esto porfavor ignore el email y su clave continuara siendo la misma.</p>
      `,
  }
}

const turnConfirmationEmail = function (userEmail, turn, branchName) {
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Confirmacion de reserva de turno',
    html: `
    <p>Su reserva a sido exitosa</p>
    <p>Usted posee un turno el dia ${turn.date} a las ${turn.time}h en la sucursal ${branchName}</p>
    `,
  }
}

const editedTurnEmail = function (userEmail, turn) {
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Edición de turno',
    html: `
      <p>Su turno a sido editado con éxito y se llevara acabo el ${turn.date} a las ${turn.time}h</p>
      `,
  }
}

const canceledTurnEmail = function (userEmail, turn) {
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: 'Cancelacion de turno',
    html: `
      <p>Su turno del la fecha ${turn.date} a sido cancelado</p>
      `,
  }
}

const avisoTurno24hs = function (userEmail,date,time,nameBranch) {
  return email = {
    to: userEmail,
    from: 'turnoswebp5@gmail.com',
    subject: `Recordatorio: Turno ${date}`,
    html: `
    <h2>Recordatorio: </h2>
    <p>Usted posee un turno el dia <strong>${date}</strong> a las <strong>${time}hs</strong>  
    en la sucursal <strong> ${nameBranch} </strong></p>
    `,
  }
}

module.exports = { resetEmail, changePasswordEmail, canceledTurnEmail, editedTurnEmail, turnConfirmationEmail, userCreationEmail, avisoTurno24hs}

