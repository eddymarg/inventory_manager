// const { formatRecommendations } = require("../api/responseFormat")

// describe('formatRecommendations', () => {
//     it('should replace quotes with a space', () => {
//         const input = '1. "The Great Gatsby" is great.'
//         const result = formatRecommendations(input)
//         expect(result).toBe(`[<ForwardRef(Typography) component="span" style={{"display": "block", "fontFamily": "'Roboto',sans-serif", "fontSize": "1.25rem", "fontWeight": "bold", "marginTop": "1rem"}} variant="body1">1.  The Great Gatsby  is great.</ForwardRef(Typography)>]`)
//     })

//     it('should format numbered lines correctly', () => {
//         const input = '1. The first line\n2. The second line'
//         const result = formatRecommendations(input)
//         expect(result).toHaveLength(2)
//     })

//     it('should handle empty input', () => {
//         const input ='';
//         const result = formatRecommendations(input)
//         expect(result).toEqual([])
//     })
// });