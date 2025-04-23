/**
 * Utility functions for tracking video progress
 */

/**
 * Merges overlapping intervals to calculate unique watched time
 * @param {Array} intervals - Array of {start, end} objects representing watched intervals
 * @returns {Array} - Merged intervals with no overlaps
 */
export const mergeIntervals = (intervals) => {
    if (intervals.length <= 1) return intervals

    // Sort intervals by start time
    const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start)

    const result = [sortedIntervals[0]]

    for (let i = 1; i < sortedIntervals.length; i++) {
        const current = sortedIntervals[i]
        const lastMerged = result[result.length - 1]

        // If current interval overlaps with the last merged interval
        if (current.start <= lastMerged.end) {
            // Extend the end of the last merged interval if needed
            lastMerged.end = Math.max(lastMerged.end, current.end)
        } else {
            // Add the current interval to the result
            result.push(current)
        }
    }

    return result
}

/**
 * Calculates total unique seconds watched from intervals
 * @param {Array} intervals - Array of {start, end} objects representing watched intervals
 * @returns {Number} - Total unique seconds watched
 */
export const calculateUniqueWatchedTime = (intervals) => {
    return intervals.reduce((total, interval) => {
        return total + (interval.end - interval.start)
    }, 0)
}

/**
 * Calculates progress percentage based on unique watched time
 * @param {Array} intervals - Array of {start, end} objects representing watched intervals
 * @param {Number} duration - Total video duration in seconds
 * @returns {Number} - Progress percentage (0-100)
 */
export const calculateProgressPercentage = (intervals, duration) => {
    if (!duration) return 0

    const uniqueSeconds = calculateUniqueWatchedTime(intervals)
    return Math.min(100, Math.round((uniqueSeconds / duration) * 100))
}

/**
 * Saves watched intervals to localStorage
 * @param {Array} intervals - Array of {start, end} objects representing watched intervals
 * @param {String} videoId - Identifier for the video
 */
export const saveWatchedIntervals = (intervals, videoId) => {
    localStorage.setItem(`watchedIntervals_${videoId}`, JSON.stringify(intervals))
}

/**
 * Loads watched intervals from localStorage
 * @param {String} videoId - Identifier for the video
 * @returns {Array} - Array of {start, end} objects representing watched intervals
 */
export const loadWatchedIntervals = (videoId) => {
    const savedIntervals = localStorage.getItem(`watchedIntervals_${videoId}`)
    return savedIntervals ? JSON.parse(savedIntervals) : []
}

/**
 * Saves last watched position to localStorage
 * @param {Number} position - Last watched position in seconds
 * @param {String} videoId - Identifier for the video
 */
export const saveLastPosition = (position, videoId) => {
    localStorage.setItem(`lastPosition_${videoId}`, position.toString())
}

/**
 * Loads last watched position from localStorage
 * @param {String} videoId - Identifier for the video
 * @returns {Number} - Last watched position in seconds
 */
export const loadLastPosition = (videoId) => {
    const savedPosition = localStorage.getItem(`lastPosition_${videoId}`)
    return savedPosition ? Number.parseFloat(savedPosition) : 0
}