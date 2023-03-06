/**
 * This function takes in a hexcolor and returns the text color that will have enough contrast with that color
 * to be readable.
 * An example use case is making the text on the MUI Chip components readable even when the color of the chip itself changes.
 * @param hexcolor a hexcolor such as #1A3456
 * @returns "black" or "white", depeneding on what color will be more readable
 */
export default function getContrastYIQ(hexcolor: string) {
  var colorNoHash = hexcolor.substring(1, hexcolor.length - 1)
  var r = parseInt(colorNoHash.substring(0, 2), 16)
  var g = parseInt(colorNoHash.substring(2, 4), 16)
  var b = parseInt(colorNoHash.substring(4, 2), 16)
  var yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}
