import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
// import { useParams } from "react-router"
import { useState } from "react"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const [interviewId, setInterviewId] = useState(null)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async (data) => {
        try {
            setLoading(true) // ✅ show loading screen immediately

            const res = await generateInterviewReport(data)

            if (!res || !res.interviewReport) {
                throw new Error("Invalid API response")
            }

            setInterviewId(res.interviewReport._id)
            return res.interviewReport

        } catch (err) {
            console.error("generateReport failed:", err)
            throw err
        } finally {
            setLoading(false) // ✅ always hide loading when done
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Fix - separate concerns clearly
    useEffect(() => {
        getReports() // fetch reports once on mount
    }, [])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId) // only runs when interviewId changes
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}